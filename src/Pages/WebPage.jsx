import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/WebPage/Navbar/Navbar';
import Content from '../Components/WebPage/Content/Content';
import Courses from '../Components/WebPage/Courses/Courses';
import StatsSection from '../Components/WebPage/StatsSection/StatsSection';
import NewsSection from '../Components/WebPage/NewsSection/NewsSection';
import Footer from '../Components/WebPage/Footer/Footer';
import LastCom from '../Components/WebPage/LastCom/LastCom';





export default function WebPage() {
  return (
    <div>
      <Navbar/>
        <Content/>
          <Courses/>
            <StatsSection/>
              <NewsSection/>
                <Footer/> 
                  <LastCom/> 
    </div>
  )
}
