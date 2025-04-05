import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Store } from '../../Store';

function AuctionItem({
  id,
  title,
  imageUrl,
  endDate,
  LocationURL,
  currentBid,
  highestBidder,
  handleDeleteAuction,
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [auctionEnded, setAuctionEnded] = useState(false);
  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = (new Date(endDate) - new Date()) / 1000;
      if (duration <= 0) {
        setTimeLeft(`0d 0h 0m 0s`);
        setAuctionEnded(true);
      } else {
        const days = Math.floor(duration / (24 * 3600));
        const hours = Math.floor((duration % (24 * 3600)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endDate]);

  const handleDelete = () => {
    handleDeleteAuction();
  };

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden" key={id}>
      <Helmet>
        <title>Auction House-PLOT CONNECT</title>
      </Helmet>
      <div className="relative">
        <img
          src={imageUrl}
          alt="ItemImage"
          className="w-full h-48 object-contain hover:scale-105 duration-500"
        />
        {userInfo && userInfo.isAdmin && (
          <button className="absolute top-0 right-0" onClick={handleDelete}>
            <i className="fas fa-trash-alt text-gray-200 bg-transparent hover:text-gray-500 hover:bg-gray-200 duration-200 px-2 py-2"></i>
          </button>
        )}
      </div>
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">
          Current Bid: ₹{currentBid.toLocaleString('en-IN')}
        </p>
        <p className="text-gray-600">
          Time Left: <span className="font-bold">{timeLeft}</span>
        </p>
        {auctionEnded ? (
          <>
            {userInfo && highestBidder === userInfo.name ? (
              <Link to={`/auctions/${id}`}>
                <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white duration-200 rounded-md mt-4">
                  You Win!
                </button>
              </Link>
            ) : (
              <button
                className="w-full py-2 px-4 cursor-not-allowed bg-gray-100 text-gray-400 duration-200 rounded-md mt-4"
                disabled
              >
                Auction Ended
              </button>
            )}
          </>
        ) : (
       <>
          <Link to={userInfo ? `/auctions/${id}` : '/signin'}>
            <button className="w-full py-2 px-4 bg-gray-300 text-gray-600 duration-200 rounded-md mt-4 hover:bg-gray-400">
              Bid Now ...
            </button>
          </Link>
          <button 
            className="w-full py-2 px-4 bg-blue-300 text-gray-600 duration-200 rounded-md mt-4 hover:bg-blue-400 flex items-center justify-center gap-2"
            onClick={() => window.open(LocationURL, '_blank')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            View Location
          </button>
        </>
        )}
      </div>
    </div>
  );
}

export  default AuctionItem;
