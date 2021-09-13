import { RootStateValue } from "./reducers/rootReducer";

export interface UserStateValue {
  name: string;
  userID: string;
  masterID: string;
  adminID: string;
  role: string;
}

export interface Category {
  _id: string;
  category: string;
}

export interface User {
  _id: string,
  email: string,
  name: string,
  password: string,
  login: string,
  rating: number,
  picture: string,
}

export interface Search {
  category: string;
  location: string;
}

export interface Master {
  picture: string | undefined;
  _id: string;
  email: string;
  name: string;
  password: string;
  login: string;
  rating: string;
  description: string;
  phoneNumber: string;
  category: {
    _id: string;
    category: string;
  };
  experience: string;
  reviews: string[];
  location: {
    _id: string,
    city: string,
    coordinates: number[]
  };
}

const initState: RootStateValue = {
  masters: [],
  categories: [],
  user: {
    name: "",
    userID: "",
    masterID: "",
    adminID: "",
    role: "",
  },
  search: {
    category: "",
    location: "",
  },
  errorMessage: '',
};

export default initState;
