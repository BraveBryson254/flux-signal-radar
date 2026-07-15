import { supabase } from "./supabaseClient";

/**
 * Rooms stay platform-defined (like Schools) — real per-room presence
 * (who's online right now) would need Supabase Realtime, out of scope
 * for this pass. Posts, votes, comments, and the two stat views below
 * are all real.
 *
 * Voting: community_post_votes now stores a signed value (+1/-1) per
 * user per post, not just a boolean like — a genuine Reddit-style
 * upvote/downvote, not a Facebook-style like.
 */

export type SortMode = "hot" | "new" | "top";

export interface CommunityPost {
  id: string;
  userId: string;
  author: string;
  roomId: string;
  title: string;
  body: string;
  score: number; // upvotes - downvotes
  myVote: 1 | -1 | 0;
  commentCount: number;
  createdAt: string;
  createdAtIso: string;
}

interface PostRow {
  id: string;
  user_id: string;
  user_name: string;
  room_id: string;
  title: string;
  body: string;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Standard Reddit-style "hot" score: net votes decayed by post age. */
function hotScore(score: number, createdAtIso: string): number {
  const ageHours = (Date.now() - new Date(createdAtIso).getTime()) / (1000 * 60 * 60);
  return score / Math.pow(ageHours + 2, 1.5);
}

export async function fetchPosts(
  roomId: string,
  userId?: string,
  sort: SortMode = "hot"
): Promise<CommunityPost[]> {
  const { data: posts } = await supabase
    .from("community_posts")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  const rows = (posts ?? []) as PostRow[];
  if (rows.length === 0) return [];

  const postIds = rows.map((r) => r.id);
  const [{ data: votes }, { data: comments }] = await Promise.all([
    supabase.from("community_post_votes").select("post_id, user_id, value").in("post_id", postIds),
    supabase.from("community_comments").select("post_id").in("post_id", postIds),
  ]);

  const voteRows = (votes ?? []) as { post_id: string; user_id: string; value: number }[];
  const scoreByPost = new Map<string, number>();
  const myVoteByPost = new Map<string, 1 | -1>();
  for (const v of voteRows) {
    scoreByPost.set(v.post_id, (scoreByPost.get(v.post_id) ?? 0) + v.value);
    if (userId && v.user_id === userId) myVoteByPost.set(v.post_id, v.value as 1 | -1);
  }

  const commentRows = (comments ?? []) as { post_id: string }[];
  const commentCountByPost = new Map<string, number>();
  for (const c of commentRows) {
    commentCountByPost.set(c.post_id, (commentCountByPost.get(c.post_id) ?? 0) + 1);
  }

  const mapped: CommunityPost[] = rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    author: r.user_name,
    roomId: r.room_id,
    title: r.title,
    body: r.body,
    score: scoreByPost.get(r.id) ?? 0,
    myVote: myVoteByPost.get(r.id) ?? 0,
    commentCount: commentCountByPost.get(r.id) ?? 0,
    createdAt: timeAgo(r.created_at),
    createdAtIso: r.created_at,
  }));

  if (sort === "new") return mapped; // already created_at desc
  if (sort === "top") return [...mapped].sort((a, b) => b.score - a.score);
  return [...mapped].sort((a, b) => hotScore(b.score, b.createdAtIso) - hotScore(a.score, a.createdAtIso));
}

export async function createPost(userId: string, userName: string, roomId: string, body: string) {
  const title = body.length > 60 ? body.slice(0, 60) + "…" : body;
  await supabase
    .from("community_posts")
    .insert({ user_id: userId, user_name: userName, room_id: roomId, title, body });
}

/** Casts, changes, or removes a vote. Clicking the same direction again
 * removes the vote (toggle off), matching standard Reddit behavior. */
export async function castVote(postId: string, userId: string, value: 1 | -1, currentVote: 1 | -1 | 0) {
  if (currentVote === value) {
    await supabase.from("community_post_votes").delete().eq("post_id", postId).eq("user_id", userId);
  } else {
    await supabase
      .from("community_post_votes")
      .upsert({ post_id: postId, user_id: userId, value }, { onConflict: "post_id,user_id" });
  }
}

// ---- Comments ---------------------------------------------------------

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  author: string;
  parentCommentId: string | null;
  body: string;
  createdAt: string;
}

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  parent_comment_id: string | null;
  body: string;
  created_at: string;
}

export async function fetchComments(postId: string): Promise<CommunityComment[]> {
  const { data } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  return ((data ?? []) as CommentRow[]).map((c) => ({
    id: c.id,
    postId: c.post_id,
    userId: c.user_id,
    author: c.user_name,
    parentCommentId: c.parent_comment_id,
    body: c.body,
    createdAt: timeAgo(c.created_at),
  }));
}

export async function createComment(
  postId: string,
  userId: string,
  userName: string,
  body: string,
  parentCommentId?: string
) {
  await supabase.from("community_comments").insert({
    post_id: postId,
    user_id: userId,
    user_name: userName,
    parent_comment_id: parentCommentId ?? null,
    body,
  });
}

// ---- Stats --------------------------------------------------------------

export interface CommunityStats {
  memberCount: number;
  messagesThisWeek: number;
}

export async function fetchCommunityStats(): Promise<CommunityStats> {
  const { data } = await supabase.from("community_stats").select("member_count, messages_this_week").maybeSingle();
  return {
    memberCount: data?.member_count ?? 0,
    messagesThisWeek: data?.messages_this_week ?? 0,
  };
}

export interface TopLearnerRow {
  userId: string;
  name: string;
  itemsCompleted: number;
}

export async function fetchTopLearners(limit = 5): Promise<TopLearnerRow[]> {
  const { data } = await supabase
    .from("top_learners")
    .select("user_id, name, items_completed")
    .limit(limit);

  return (data ?? []).map((row: { user_id: string; name: string; items_completed: number }) => ({
    userId: row.user_id,
    name: row.name,
    itemsCompleted: row.items_completed,
  }));
}
