interface SignupData {
  id: number;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  profile_image?: string;
  created_at: Date;
};

export default SignupData;
