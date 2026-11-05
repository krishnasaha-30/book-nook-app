export const site = {
  name: "BookNook",
  tagline: "A small online library for big readers.",
  description:
    "BookNook is a shared online library. Add the books you love, borrow from the community, and return them when you are done.",
  contact: {
    email: "hello@booknook.library",
    phone: "+880 1700 000 000",
    address: "12 Lantern Lane, Dhaka 1207",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book", private: true },
  { href: "/my-books", label: "My Books", private: true },
  { href: "/my-borrows", label: "My Borrows", private: true },
] as const;

export const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
] as const;
