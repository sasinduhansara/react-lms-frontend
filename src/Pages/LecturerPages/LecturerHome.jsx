import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../Components/WebPage/Navbar/Navbar";
import Navtabs from "../../Components/Lecturer/Navtabs/Navtabs";
import Carousel from "../../Components/Admin/Carousel/Carousel";

import Footer from "../../Components/WebPage/Footer/Footer";

export default function WebPage() {
  return (
    <div>
      <Navbar />
      <Navtabs />

      <Carousel />

      <Footer />
    </div>
  );
}
