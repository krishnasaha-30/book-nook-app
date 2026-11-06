export type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Others";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: BookCategory;
  imageUrl: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  ownerId?: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = {
  title: string;
  author: string;
  category: BookCategory;
  imageUrl: string;
  description: string;
  totalCopies: number;
};

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status: "active" | "returned";
  createdAt: string;
}
