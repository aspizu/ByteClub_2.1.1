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
/** Get Mentorship. */
export async function get_mentorship(mentor_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/get_mentorship',{mentor_id})}
/** Delete Mentorship. */
export async function delete_mentorship(mentor_id:number):Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/delete_mentorship',{mentor_id})}
/** Become a mentor. */
export async function become_mentor(expertise:string,availability:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/become_mentor',{expertise,availability})}
/** Return all mentors. */
export async function find_mentors():Promise<ReprocaMethodResponse<(Mentor)[]>>{return await reproca.callMethod('/find_mentors',{})}
/** Return filtered mentors. */
export async function filter_mentors(expertise:string,availability:number):Promise<ReprocaMethodResponse<(Mentor)[]>>{return await reproca.callMethod('/filter_mentors',{expertise,availability})}
/** Update mentor. */
export async function update_mentor(expertise:string,availability:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/update_mentor',{expertise,availability})}
/** Delete mentor. */
export async function delete_mentor():Promise<ReprocaMethodResponse<null>>{return await reproca.callMethod('/delete_mentor',{})}
/** Create new startup. Returns startup id. */
export async function create_startup(name:string,description:string,mission_statement:string,offerings:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/create_startup',{name,description,mission_statement,offerings})}
/** Add founder to startup. */
export async function add_founder(user_id:number,startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/add_founder',{user_id,startup_id})}
/** Return startup by id. */
export async function get_startup(startup_id:number):Promise<ReprocaMethodResponse<Startup>>{return await reproca.callMethod('/get_startup',{startup_id})}
/** Return all startups. */
export async function get_startups():Promise<ReprocaMethodResponse<(Startup)[]>>{return await reproca.callMethod('/get_startups',{})}
/** Update startup. */
export async function update_startup(startup_id:number,name:string,description:string,mission_statement:string,offerings:string):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/update_startup',{startup_id,name,description,mission_statement,offerings})}
/** Delete a startup. */
export async function delete_startup(startup_id:number):Promise<ReprocaMethodResponse<boolean>>{return await reproca.callMethod('/delete_startup',{startup_id})}
/** Reproca session store. */
export interface User{id:number;username:string;created_at:number;}
/** None */
export interface Blog{id:number;title:string;content:string;author_id:number;author_username:string;author_picture:string;}
/** Mentor structure. */
export interface Mentor{user_id:number;username:string;expertise:string;availability:number;picture:string;}
/** Startup structure. */
export interface Startup{id:number;name:string;description:string;mission_statement:string;offerings:string;created_at:number;}