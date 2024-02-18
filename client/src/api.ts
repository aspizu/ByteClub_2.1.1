import type {ReprocaMethodResponse} from "./reproca";import reproca from "./reproca_config.ts";
/** Create new blog. Returns blog id. */
export async function post_blog(title:string,content:string):Promise<ReprocaMethodResponse<((number)|(null))>>{return await reproca.callMethod('/post_blog',{title,content})}
/** Delete a blog. */
export async function delete_blog(blog_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/delete_blog',{blog_id})}
/** Return all blogs. */
export async function get_blogs():Promise<ReprocaMethodResponse<(Blog)[]>>{return await reproca.callMethod('/get_blogs',{})}
/** Become a mentor. */
export async function become_mentor(expertise:string,availability:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/become_mentor',{expertise,availability})}
/** Return all mentors. */
export async function find_mentors():Promise<ReprocaMethodResponse<(Mentor)[]>>{return await reproca.callMethod('/find_mentors',{})}
/** Update mentor. */
export async function update_mentor(expertise:string,availability:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/update_mentor',{expertise,availability})}
/** Delete mentor. */
export async function delete_mentor():Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/delete_mentor',{})}
/** Get Mentorship. */
export async function get_mentorship(mentor_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/get_mentorship',{mentor_id})}
/** Delete Mentorship. */
export async function delete_mentorship(mentor_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/delete_mentorship',{mentor_id})}
/** Login to account. */
export async function login(username:string,password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/login',{username,password})}
/** Register new user. */
export async function register(username:string,password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/register',{username,password})}
/** Change password if old password is given, requires user be logged-in. */
export async function set_password(old_password:string,new_password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/set_password',{old_password,new_password})}
/** Change given details for user. */
export async function update_profile(bio:((string)|(null))):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/update_profile',{bio})}
/** Follow a user. */
export async function follow_user(user_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/follow_user',{user_id})}
/** Unfollow a user. */
export async function unfollow_user(user_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/unfollow_user',{user_id})}
/** Return session user. */
export async function get_session():Promise<ReprocaMethodResponse<((User)|(null))>>{return await reproca.callMethod('/get_session',{})}
/** Reproca session store. */
/**User Structure */
export interface User{id:number;username:string;created_at:number;}
/** Blog Structure */
export interface Blog{id:number;title:string;content:string;author_id:number;author_username:string;author_picture:string;}
/** Mentor structure. */
export interface Mentor{user_id:number;username:string;expertise:string;availability:number;picture:string;}
/** Startup structure. */
export interface Startup{id:number;name:string;description:string;mission_statement:string;offerings:string;created_at:number;}