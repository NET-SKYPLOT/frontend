import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import slider1 from "/assets/img/slider-1.png";
import slider2 from "/assets/img/slider-2.png";
import slider3 from "/assets/img/slider-3.png";

const images = [slider1, slider2, slider3];

const ImageCarousel = () => {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{clickable: true}}
                autoplay={{delay: 3000, disableOnInteraction: false}}
                loop={true}
                className="rounded-lg shadow-lg"
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-[300px] object-cover rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;
