"use client";

import Link from "next/link";

const LINKS = [
  {
    url: "https://aws.amazon.com",
    name: "AWS",
  },
  {
    url: "https://docs.aws.amazon.com/",
    name: "AWS Documentation",
  },
  {
    url: "https://www.godaddy.com/",
    name: "GoDaddy",
  },
  {
    url: "https://ui.shadcn.com",
    name: "Shadcn/ui",
  },
  {
    url: "https://resend.com/",
    name: "Resend",
  },
  {
    url: "https://fontawesome.com/",
    name: "Font Awesome",
  },
  {
    url: "https://tailwindcss.com/",
    name: "Tailwind",
  },
  {
    url: "https://www.mongodb.com/",
    name: "MongoDB",
  },
  {
    url: "https://nextjs.org/",
    name: "Next.js",
  },
];

function Docs() {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex flex-col justify-between gap-2">
        <h1 className="font-bold text-lg">Get Started</h1>
        <p>Welcome to MJP Hub</p>
      </div>
      <div>
        <h3 className="font-bold">Important Links</h3>
        <ul className="list-disc ml-6">
          {LINKS.map((link, i) => (
            <li key={i} className="mt-1">
              <Link href={link.url} target="_blank">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Docs;
