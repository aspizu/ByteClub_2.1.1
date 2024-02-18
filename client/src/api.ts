import type {ReprocaMethodResponse} from "./reproca";import reproca from "./reproca_config.ts";
/** Create new blog. Returns blog id. */
export async function post_blog(title:string,content:string):Promise<ReprocaMethodResponse<((number)|(null))>>{return await reproca.callMethod('/post_blog',{title,content})}
/** Return all blogs. */
export async function get_blogs():Promise<ReprocaMethodResponse<(Blog)[]>>{return await reproca.callMethod('/get_blogs',{})}
/** Return a single blog by ID. */
export async function get_blog(blog_id:number):Promise<ReprocaMethodResponse<((Blog)|(null))>>{return await reproca.callMethod('/get_blog',{blog_id})}
/** Return all blogs. */
export async function get_user_blogs(username:string):Promise<ReprocaMethodResponse<(UserBlog)[]>>{return await reproca.callMethod('/get_user_blogs',{username})}
/** Get Mentorship. */
export async function start_mentorship(mentee_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/start_mentorship',{mentee_id})}
/** Stop Mentorship. */
export async function stop_mentorship(mentee_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/stop_mentorship',{mentee_id})}
/** Create new startup. Returns startup id. */
export async function create_startup(name:string,description:string,mission_statement:string,offerings:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/create_startup',{name,description,mission_statement,offerings})}
/** Add founder to startup. */
export async function add_founder(user_id:number,startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/add_founder',{user_id,startup_id})}
/** Return startup by id. */
export async function get_startup(startup_id:number):Promise<ReprocaMethodResponse<Startup>>{return await reproca.callMethod('/get_startup',{startup_id})}
/** Return all startups. */
export async function get_startups():Promise<ReprocaMethodResponse<(Startup)[]>>{return await reproca.callMethod('/get_startups',{})}
/** Update startup. */
export async function update_startup(startup_id:number,name:((string)|(null)),description:((string)|(null)),mission_statement:((string)|(null)),offerings:((string)|(null))):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/update_startup',{startup_id,name,description,mission_statement,offerings})}
/** Delete a startup. */
export async function delete_startup(startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/delete_startup',{startup_id})}
/** Follow a startup. */
export async function follow_startup(startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/follow_startup',{startup_id})}
/** Unfollow a startup. */
export async function unfollow_startup(startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/unfollow_startup',{startup_id})}
/** Login to account. */
export async function login(username:string,password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/login',{username,password})}
/** Register new user. */
export async function register(username:string,password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/register',{username,password})}
/** Change password if old password is given, requires user be logged-in. */
export async function set_password(old_password:string,new_password:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/set_password',{old_password,new_password})}
/** Change given details for user. */
export async function update_user(link:((string)|(null)),email:((string)|(null)),name:((string)|(null)),bio:((string)|(null)),experience:((string)|(null)),is_mentor:((boolean)|(null)),mentor_available:((boolean)|(null)),mentor_expertise:((string)|(null))):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/update_user',{link,email,name,bio,experience,is_mentor,mentor_available,mentor_expertise})}
/** Follow a user. */
export async function follow_user(user_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/follow_user',{user_id})}
/** Unfollow a user. */
export async function unfollow_user(user_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/unfollow_user',{user_id})}
/** Return session user. */
export async function get_session():Promise<ReprocaMethodResponse<((User)|(null))>>{return await reproca.callMethod('/get_session',{})}
/** Search for all users, blogs and startups. */
export async function search_all(query:string):Promise<ReprocaMethodResponse<(Search)[]>>{return await reproca.callMethod('/search_all',{query})}
/** Get a user. */
export async function get_user(username:string):Promise<ReprocaMethodResponse<((GetUser)|(null))>>{return await reproca.callMethod('/get_user',{username})}
/** Search results. */
export interface Search{type:'user'|'blog'|'startup';name:string;id:number;}
/** Startup. */
export interface Startup{id:number;name:string;description:string;mission_statement:string;offerings:string;created_at:number;}
/** Blog. */
export interface Blog{id:number;title:string;content:string;author_username:string;author_name:string;author_picture:((string)|(null));}
/** Details from get user. */
export interface GetUser{id:number;link:string;email:string;bio:string;experience:string;picture:((string)|(null));is_mentor:boolean;mentor_available:boolean;mentor_expertise:string;created_at:number;followers:([string,string])[];following:([string,string])[];}
/** Reproca session store. */
export interface User{id:number;username:string;created_at:number;}
/** Blog from a known user. */
export interface UserBlog{id:number;title:string;content:string;}