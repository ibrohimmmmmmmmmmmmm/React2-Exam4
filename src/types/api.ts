export interface UserDto {
  id?: string;
  _id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  avatar?: string;
  avatarUrl?: string;
  photo?: string;
  profilePicture?: string;
}

export interface ProfileDto {
  id?: string;
  userId?: string;
  specialization?: string;
  title?: string;
  headline?: string;
  location?: string;
  city?: string;
  country?: string;
}

export interface PostDto {
  id?: string;
  _id?: string;
  content?: string;
  text?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: UserDto;
  user?: UserDto;
  postedBy?: UserDto;
  likes?: number;
  likeCount?: number;
  commentsCount?: number;
  repostCount?: number;
}

export interface CommentDto {
  id?: string;
  _id?: string;
  content?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: UserDto;
  user?: UserDto;
  postedBy?: UserDto;
}

export interface JobDto {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  companyName?: string;
  organizationName?: string;
  location?: string;
  city?: string;
  country?: string;
  salary?: string;
  salaryRange?: string;
  minSalary?: number;
  maxSalary?: number;
  employmentType?: string;
  jobType?: string;
  type?: string;
  description?: string;
  createdAt?: string;
  publishedAt?: string;
}
