import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Loading from '../../Components/Loading/Loading';
import { Store } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistory() {
  const [Aucions,setAuctions] = useState([])
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      let userName = userInfo.name

      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/getMyOction/${userName}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log('userInfo', data);
        setAuctions(data)
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History-EcomBidding</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="p-4 border rounded-md bg-gray-100 text-gray-700">
          Your Order Page is empty.{' '}
          <Link to="/" className="text-cyan-600 font-bold">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Order History </h1>

          {/* Primary card */}
          <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden mb-4">
            <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-300 font-medium text-sm">
              <div className="py-3 px-4">plot</div>
              <div className="py-3 px-4"> End Date</div>
              <div className="py-3 px-4">your Bid</div>
              {/* <div className="py-3 px-4"></div> */}
              <div className="py-3 px-4">Bid Confirmed</div>
              <div className="py-3 px-4">Actions</div>
            </div>
          </div>

          {Aucions.map((Aucion) => (
            // Order card
            <div
              className="border border-gray-300 rounded-md shadow-sm overflow-hidden mx-4 mb-4 hover:scale-[101%] backface-hidden duration-300"
              key={Aucion._id}
            >
              <div className="grid grid-cols-6 bg-gray-100 text-sm font-medium text-gray-700">
                <div className="py-4 px-4 flex items-center">
                
                    <img
                      src={Aucion.imageUrl
                      }
                      alt="User Avatar"
                      className="rounded-full w-6 h-6 mr-[-15px] md:flex"
                      key={Aucion._id}
                    />
     
                  <span className="truncate ml-0 sm:ml-8 hidden lg:block">
                    {Aucion._id}
                  </span>
                </div>
                <div className="py-4 px-4">
                  {Aucion.createdAt.substring(0, 10)}
                </div>
                <div className="py-4 px-4 font-auto">
                  <small>₹</small>
                  {Aucion.currentBid.toFixed(2)}
                </div>
                {/* <div
                  className={`py-4 px-4 ${
                    Aucion.endDate ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Aucion.endDate ? 'Yes' : 'No'}
                </div> */}
                <div
                  className={`py-4 px-4 ${Aucion.createdAt.substring(0, 10)}
.isDelivered ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Aucion.updatedAt ? 'Yes' : 'No'}
                </div>
                <div className="py-3 px-auto lg:px-4 text-center">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center "
                    onClick={() => {
                      navigate(`/order/${Aucion._id}`);
                    }}
                  >
                    <p className="p-[6px] bg-slate-200 rounded-md hover:bg-slate-300 duration-200">
                      Details
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
