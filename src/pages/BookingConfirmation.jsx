import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Ticket from '../components/Ticket/Ticket';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import api from '../services/api';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const { user } = useAuth();
  const ticketRef = useRef(null);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to download ticket as PDF
  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    try {
      // Convert the ticket div to a PNG image using dom-to-image
      const dataUrl = await domtoimage.toPng(ticketRef.current, { 
        quality: 0.95,
        backgroundColor: '#ffffff'
      });
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Create an image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // Calculate dimensions to fit the PDF page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        // Add the image to the PDF
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Save the PDF
        pdf.save(`ticket-${bookingData.pnrNumber}.pdf`);
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        alert('Failed to generate PDF. Please try again.');
      };
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // Fetch booking data if coming from URL parameter
  useEffect(() => {
    if (bookingId) {
      const fetchBookingData = async () => {
        try {
          const response = await api.get(`/bookings/${bookingId}`);
          
          if (response.ok) {
            const data = await response.json();
            setBookingData(data.booking);
          } else {
            // If booking not found via API, try from navigation state
            const state = location.state;
            if (state && state.bookingData) {
              setBookingData(state.bookingData);
            } else {
              navigate('/booking-summary');
            }
          }
        } catch (error) {
          console.error('Error fetching booking data:', error);
          // Fallback to navigation state if API call fails
          const state = location.state;
          if (state && state.bookingData) {
            setBookingData(state.bookingData);
          } else {
            navigate('/booking-summary');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookingData();
    } else {
      // Get booking data from navigation state
      const state = location.state;
      if (!state || !state.bookingData) {
        navigate('/booking-summary');
        return;
      }

      setBookingData(state.bookingData);
      setIsLoading(false);
    }
  }, [bookingId, location.state, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">Booking data not found. Please try again.</p>
          <button 
            onClick={() => navigate('/booking-summary')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your bus ticket has been successfully booked.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
            <button 
              onClick={downloadPDF}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Ticket
            </button>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Ticket
            </button>
          </div>

          <div className="flex justify-center">
            <div ref={ticketRef}>
              <Ticket booking={bookingData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
