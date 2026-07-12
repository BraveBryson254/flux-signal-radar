import { supabase } from "./supabaseClient";

/**
 * Rooms stay platform-defined (like Schools) — real per-room presence
 * (who's online right now) would need Supabase Realtime, out of scope
 * for this pass, so room cards no longer show fabricated member/online
 * counts. Posts, likes, and the two stat views below are all real.
 */

export interface CommunityPost {
  id: string;
  userId: string;
  author: string;
  roomId: string;
  title: string;
  body: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
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

export async function fetchPosts(roomId: string, userId?: string): Promise<CommunityPost[]> {
  const { data: posts } = await supabase
    .from("community_posts")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  const rows = (posts ?? []) as PostRow[];
  if (rows.length === 0) return [];

  const { data: likes } = await supabase
    .from("community_post_likes")
    .select("post_id, user_id")
    .in("post_id", rows.map((r) => r.id));

  const likeRows = (likes ?? []) as { post_id: string; user_id: string }[];
  const countByPost = new Map<string, number>();
  const likedByMeSet = new Set<string>();
  for (const l of likeRows) {
    countByPost.set(l.post_id, (countByPost.get(l.post_id) ?? 0) + 1);
    if (userId && l.user_id === userId) likedByMeSet.add(l.post_id);
  }

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    author: r.user_name,
    roomId: r.room_id,
    title: r.title,
    body: r.body,
    likeCount: countByPost.get(r.id) ?? 0,
    likedByMe: likedByMeSet.has(r.id),
    createdAt: timeAgo(r.created_at),
  }));
}

export async function createPost(userId: string, userName: string, roomId: string, body: string) {
  // Title is derived from the first line for the feed card header; the
  // composer is a single field, matching the existing UI.
  const title = body.length > 60 ? body.slice(0, 60) + "…" : body;
  await supabase
    .from("community_posts")
    .insert({ user_id: userId, user_name: userName, room_id: roomId, title, body });
}

export async function toggleLike(postId: string, userId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    await supabase.from("community_post_likes").delete().eq("post_id", postId).eq("user_id", userId);
  } else {
    await supabase.from("community_post_likes").insert({ post_id: postId, user_id: userId });
  }
}

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
