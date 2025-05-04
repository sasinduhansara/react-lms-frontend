import React from 'react';
import BootstrapCarousel from 'react-bootstrap/Carousel';
import CarouselImage from './CarouselImage';
import './Carousel.css';

const Carousel = () => {
  return (
    <BootstrapCarousel>
      <BootstrapCarousel.Item>
        <CarouselImage imageUrl="/images/slide1.jpg" altText="First Slide" />
        <BootstrapCarousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </BootstrapCarousel.Caption>
      </BootstrapCarousel.Item>

      <BootstrapCarousel.Item>
        <CarouselImage imageUrl="/images/slide2.jpg" altText="Second Slide" />
        <BootstrapCarousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </BootstrapCarousel.Caption>
      </BootstrapCarousel.Item>

      <BootstrapCarousel.Item>
        <CarouselImage imageUrl="/images/slide3.jpg" altText="Third Slide" />
        <BootstrapCarousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </BootstrapCarousel.Caption>
      </BootstrapCarousel.Item>
    </BootstrapCarousel>
  );
};

export default Carousel;
