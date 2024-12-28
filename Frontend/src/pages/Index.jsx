import React from "react";
import Header from "./Header";
import HomePageLayout from "./HomePage/HomePageLayout";
import Footer from "./Footer";

export default function Index() {
  return (
    <div>
      <Header></Header>
      <HomePageLayout></HomePageLayout>
      {/* <Footer></Footer> */}
    </div>
  );
}
