import {
  Body,
  Button,
  Column,
  Font,
  Head,
  Hr,
  Html,
  Row,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  // email: string;
}

const tailwindConfig = {
  theme: {
    colors: {
      transparent: "transparent",
      background: "#0E0F1E",
      primary: "#F300AE",
      secondary: "#8E39C5",
      card: "#7B61FF",
      white: "#ffffff",
      error: "#B3001B",
    },
    fontSize: {
      xxs: "8px",
      xs: "10px",
      sm: "12px",
      md: "16px",
      lg: "25px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
};

export const Deployment = () => {
  return (
    <Html lang="en" dir="ltr" className="bg-background">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-background text-white m-0 p-0">
          <h2 className="text-lg m-0 mb-[25px] text-center pt-20">
            Deployment Finished
          </h2>
          <div className="h-[500px] min-w-[250px] flex flex-col items-start justify-start gap-[3px] bg-card/5 rounded-[10px] m-auto relative overflow-hidden box-border mx-2">
            <div className="py-[15px] px-[15px] w-full box-border text-left flex gap-5 justify-center">
              <div className="flex flex-col">
                <Row>Site:</Row>
                <Row>Finished:</Row>
              </div>
              <div className="flex flex-col">
                <Row>MJP Hub</Row>
                <Row>9/19/24 7:13 PM</Row>
              </div>
            </div>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Deployment;

const customBorder = {
  borderImage: `url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3crect x='1' y='1' width='98' height='98' rx='1' stroke='url(%23paint0_linear_59_93)' stroke-width='2'/%3e %3cdefs%3e %3clinearGradient id='paint0_linear_59_93' x1='0' y1='0' x2='100' y2='100' gradientUnits='userSpaceOnUse'%3e %3cstop stop-color='%23F300AE'/%3e %3cstop offset='1' stop-color='%238E39C5'/%3e %3c/linearGradient%3e %3c/defs%3e %3c/svg%3e") 2 / 2px stretch`,
};
