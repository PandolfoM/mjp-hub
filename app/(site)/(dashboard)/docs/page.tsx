"use client";

import Link from "next/link";

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
          <li>
            <Link href="https://aws.amazon.com" target="_blank">
              AWS
            </Link>
          </li>
          <li>
            <Link href="https://docs.aws.amazon.com/" target="_blank">
              AWS Documentation
            </Link>
          </li>
          <li>
            <Link href="https://www.godaddy.com/" target="_blank">
              GoDaddy
            </Link>
          </li>
          <li>
            <Link href="https://ui.shadcn.com" target="_blank">
              Shadcn/ui
            </Link>
          </li>
          <li>
            <Link href="https://fontawesome.com/" target="_blank">
              Font Awesome
            </Link>
          </li>
          <li>
            <Link href="https://tailwindcss.com/" target="_blank">
              Tailwind
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Docs;
