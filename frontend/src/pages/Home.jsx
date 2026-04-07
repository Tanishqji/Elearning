import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAccess, createOrder, verifyPayment } from '../api';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Initialize Swipers
        if (window.Swiper) {
            new window.Swiper(".books-slider", {
                loop:true,
                centeredSlides: true,
                autoplay: { delay: 9500, disableOnInteraction: false },
                breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                },
            });

            new window.Swiper(".featured-slider", {
                spaceBetween: 10,
                loop:true,
                centeredSlides: true,
                autoplay: { delay: 9500, disableOnInteraction: false },
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                },
                breakpoints: {
                  0: { slidesPerView: 1 },
                  450: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                },
            });

            new window.Swiper(".arrivals-slider", {
                spaceBetween: 10,
                loop:true,
                centeredSlides: true,
                autoplay: { delay: 9500, disableOnInteraction: false },
                breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                },
            });
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const handleDownload = async (e, pdfPath) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Please login to download books!');
            navigate('/login');
            return;
        }

        try {
            await checkAccess(token);
            const a = document.createElement('a');
            a.href = pdfPath;
            a.download = pdfPath.split('/').pop();
            a.click();
        } catch (error) {
            if (error.response?.status === 403) {
                if (window.confirm('Your 3-day free trial has expired. Subscribe for ₹299 to continue downloading books?')) {
                    handlePayment(token);
                }
            } else {
                alert('An error occurred. Please login again.');
            }
        }
    };

    const handlePayment = async (token) => {
        try {
            const { data } = await createOrder(token);
            const options = {
                key: 'rzp_test_replace_me',
                amount: data.amount,
                currency: data.currency,
                name: 'E-Kitabein Premium',
                description: 'Unlimited Book Access Subscription',
                image: '/image/logo.png',
                order_id: data.id,
                handler: async function (response) {
                    try {
                        const verification = await verifyPayment(token, response);
                        alert(verification.data.message);
                        const updatedUser = { ...user, isSubscribed: true };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setUser(updatedUser);
                    } catch (error) { alert('Payment verification failed'); }
                },
                prefill: { name: user?.username || 'User', email: user?.email || 'user@example.com' },
                theme: { color: '#27ae60' }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) { alert('Failed to initiate payment'); }
    };

    return (
        <div>
            {/* Header Section */}
            <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'white' }}>
                <div className="header-1">
                    <a href="#" className="logo"> <i className="fas fa-book"></i> E-kitabein </a>
                    <form action="" className="search-form"> 
                        <input type="search" placeholder="search here..." id="search-box" />
                        <label htmlFor="search-box" className="fas fa-search"></label>
                    </form>
                    <div className="icons" style={{display: 'flex', alignItems: 'center'}}>
                        <div id="search-btn" className="fas fa-search"></div>
                        <a href="#" className="fas fa-heart"></a>
                        {user ? (
                            <div style={{ marginLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.5rem', color: '#666' }}>{user.username}</span>
                                {user.role === 'admin' && <button onClick={() => navigate('/admin')} style={{fontSize: '1.5rem', cursor: 'pointer', background: 'none'}}>Admin</button>}
                                <button onClick={logout} style={{fontSize: '1.5rem', cursor: 'pointer', background: 'none'}}>Logout</button>
                            </div>
                        ) : (
                            <div id="login-btn" className="fas fa-user" onClick={() => navigate('/login')}></div>
                        )}
                    </div>
                </div>
                <div className="header-2">
                    <nav className="navbar">
                        <a href="#home">Home</a>
                        <a href="#featured">Featured</a>
                        <a href="#arrivals">Arrivals</a>
                        <a href="#reviews">Reviews</a>
                        <a href="#blogs">Blogs</a>
                    </nav>
                </div>
            </header>

            {/* Bottom Navbar */}
            <nav className="bottom-navbar">
                <a href="#home" className="fas fa-home"></a>
                <a href="#featured" className="fas fa-list"></a>
                <a href="#arrivals" className="fas fa-tags"></a>
                <a href="#reviews" className="fas fa-comments"></a>
                <a href="#blogs" className="fas fa-blog"></a>
            </nav>

            {/* Home Section */}
            <section className="home" id="home">
                <div className="row">
                    <div className="content">
                        <h3>UPTO 75% OFF ON UPCOMING BOOKS</h3>
                        <p style={{fontSize: '180%'}}><b><i>Escape reality by diving in to the ultimate virtual realm of books - and hey, aren't books the best of friends?</i></b> </p>
                    </div>
                    <div className="swiper books-slider">
                        <div className="swiper-wrapper">
                            <a href="#" className="swiper-slide"><img src="/image/fault.jpg" alt="" /></a>
                            <a href="#" className="swiper-slide"><img src="/image/prid.jpg" alt="" /></a>
                            <a href="#" className="swiper-slide"><img src="/image/dorian.jpg" alt="" /></a>
                            <a href="#" className="swiper-slide"><img src="/image/potter.jpg" alt="" /></a>
                            <a href="#" className="swiper-slide"><img src="/image/valleys.jpg" alt="" /></a>
                            <a href="#" className="swiper-slide"><img src="/image/die.jpg" alt="" /></a>
                        </div>
                        <img src="/image/stand.png" className="stand" alt="" />
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="featured" id="featured">
                <h1 className="heading"> <span>Featured books</span> </h1>
                <div className="swiper featured-slider">
                    <div className="swiper-wrapper">
                        {[ 
                            { title: 'Harry Potter', img: 'harry potter.jpeg', desc: 'The novels chronicle the lives of a young wizard, Harry Potter...', pdf: 'Harry_Potter_(www.ztcprep.com).pdf' },
                            { title: 'Akbar aur Birbal', img: 'akabar birbal.jpeg', desc: 'Akbar Birbal Stories – a set of moral stories inspired from the interactions...', pdf: 'Akbar and Birbal ( PDFDrive ).pdf' },
                            { title: 'Spiderman', img: 'spiderman.jpeg', desc: 'It is an intercompany graphic novel that stars story of Peter Parker...', pdf: 'spiderman-comic.pdf' },
                            { title: 'Slaughter house', img: 'kurt vonnegut.jpeg', desc: 'Slaughterhouse, or, The Children’s Crusade: A Duty-Dance with Death...', pdf: "Slaughterhouse-five_ or, The children's crusade, a duty-dance with death ( PDFDrive ).pdf" },
                            { title: 'Marketting for business', img: 'marketting hacks.jpeg', desc: 'Digital marketing trends are changing constantly...', pdf: 'Marketing Hacks For Businessowners.pdf' },
                            { title: 'How to get your client say yes!', img: 'rahul.jpeg', desc: 'Earning customer trust with honesty and integrity is not a new practice...', pdf: 'How to get your clients to say YES automatically .pdf' }
                        ].map(book => (
                            <div className="swiper-slide box" key={book.title}>
                                <div className="icons">
                                    <a href="#" className="fas fa-search"></a>
                                    <a href="#" className="fas fa-heart"></a>
                                    <a href="#" className="fas fa-eye"></a>
                                </div>
                                <div className="image"><img src={`/assets/${book.img}`} alt="" /></div>
                                <div className="content">
                                    <h3>{book.title}</h3>
                                    <p style={{fontSize: '1.4rem', color: 'var(--light-color)', padding: '1rem'}}>{book.desc}</p>
                                    <a href="#" onClick={(e) => handleDownload(e, `/pdfs/${book.pdf}`)} className="btn">Download</a>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
            </section>

            {/* Arrivals Section */}
            <section className="arrivals" id="arrivals">
                <h1 className="heading"> <span>Programming Books</span> </h1>
                <div className="swiper arrivals-slider">
                    <div className="swiper-wrapper">
                        {[
                            { title: 'DSA with python', img: 'dsa pythin.jpeg', pdf: 'Data Structure and Algorithmic Thinking with Python  Data Structure and Algorithmic Puzzles ( PDFDrive ).pdf' },
                            { title: 'Data communications', img: 'dc and networking.jpeg', pdf: 'Data Communications and Networking By Behrouz A.Forouzan.pdf' },
                            { title: 'Java for beginners', img: 'java for beg.jpeg', pdf: 'Java for Absolute Beginners_ Learn to Program the Fundamentals the Java 9+ Way ( PDFDrive ).pdf' }
                        ].map(book => (
                            <div className="swiper-slide box" key={book.title}>
                                <div className="image"><img src={`/assets/${book.img}`} alt="" /></div>
                                <div className="content">
                                    <h3>{book.title}</h3>
                                    <div className="stars">
                                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <a href="#" onClick={(e) => handleDownload(e, `/pdfs/${book.pdf}`)} className="btn" style={{fontSize: '1.2rem', marginTop: '10px'}}>Download</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 style={{marginTop: '5vh'}} className="heading"> <span>Best of sales</span> </h1>
                <div className="swiper arrivals-slider">
                    <div className="swiper-wrapper">
                        {[
                            { title: 'Get online sale', img: 'the surefire way.jpeg', pdf: 'Get Your First Online Sale.pdf' },
                            { title: 'Negotation Skills', img: 'negotation skilla.jpeg', pdf: 'Negotiation Skills By Rahul Bhatnagar.pdf' },
                            { title: 'High income skills', img: 'high income skills.jpeg', pdf: '7+ High Income Skills.pdf' }
                        ].map(book => (
                            <div className="swiper-slide box" key={book.title}>
                                <div className="image"><img src={`/assets/${book.img}`} alt="" /></div>
                                <div className="content">
                                    <h3>{book.title}</h3>
                                    <div className="stars">
                                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <a href="#" onClick={(e) => handleDownload(e, `/pdfs/${book.pdf}`)} className="btn" style={{fontSize: '1.2rem', marginTop: '10px'}}>Download</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 style={{marginTop: '5vh'}} className="heading"> <span>Top Comics</span> </h1>
                <div className="swiper arrivals-slider">
                    <div className="swiper-wrapper">
                        {[
                            { title: 'Batman', img: 'batman.jpeg', pdf: 'DC Marvel Comics - Batman & Spiderman ( PDFDrive ).pdf' },
                            { title: 'Iron man', img: 'iron man.jpeg', pdf: 'Iron Man and Sub Mariner.pdf' },
                            { title: 'Spiderman', img: 'spiderman.jpeg', pdf: 'spiderman-comic.pdf' },
                            { title: 'Wolverine', img: 'wolverine.jpeg', pdf: 'Wolverine - Old Man Logan.pdf' }
                        ].map(book => (
                            <div className="swiper-slide box" key={book.title}>
                                <div className="image"><img src={`/assets/${book.img}`} alt="" /></div>
                                <div className="content">
                                    <h3>{book.title}</h3>
                                    <div className="stars">
                                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <a href="#" onClick={(e) => handleDownload(e, `/pdfs/${book.pdf}`)} className="btn" style={{fontSize: '1.2rem', marginTop: '10px'}}>Download</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Deal Section */}
            <section className="deal">
                <div className="content">
                    <h3 style={{fontSize: '300%'}}>LATEST BOOKS ARRIVING !!!</h3>
                    <h1>upto 50% off</h1>
                    <p style={{fontSize: '200%'}}>Check out today's hot books</p>
                    <a href="#" className="btn">VIEW NOW</a>
                </div>
                <div className="image">
                    <img src="/image/deal-img.jpg" alt="" />
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter">
                <form action="">
                    <h3>Subscribe for latest updates</h3>
                    <input style={{borderRadius: '20px'}} type="email" placeholder="Enter your email" className="box" />
                    <input style={{borderRadius: '15px'}} type="submit" value="SUBSCRIBE" className="btn" />
                </form>
            </section>

            {/* Footer */}
            <section className="footer">
                <div className="box-container">
                    <div className="box">
                        <h3>our locations</h3>
                        <p><i className="fas fa-map-marker-alt"></i> Indore</p>
                    </div>
                    <div className="box">
                        <h3>quick links</h3>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Home </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Featured </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Arrivals </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Reviews </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Blogs </a>
                    </div>
                    <div className="box">
                        <h3>extra links</h3>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Account info </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Privacy policy </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Payment method </a>
                        <a href="#"> <i className="fas fa-arrow-right"></i> Our serivces </a>
                    </div>
                </div>
                <div className="credit" style={{ textAlign: 'center', padding: '2rem 0', fontSize: '1.5rem', color: '#666', borderTop: '1px solid #ccc', marginTop: '2rem' }}> 
                    all rights reserved | 
                </div>
            </section>
        </div>
    );
};

export default Home;
