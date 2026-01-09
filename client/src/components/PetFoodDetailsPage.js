import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PetFoodDetailsPage.css';  // Make sure this import is added

const PetFoodDetailsPage = () => {
  const { id } = useParams();  // Get product ID from the URL
  const [food, setFood] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/foods/${id}`);
        setFood(response.data);
      } catch (error) {
        console.error('Error fetching food details:', error);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (!food) return <h2>Loading...</h2>;

  return (
    <div className="food-details-container">
      <img src={food.imageUrl} alt={food.name} />
      <h2>{food.name}</h2>
      <p>{food.description}</p>
      <p className="product-price">Price: ${food.price}</p>
      <button className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default PetFoodDetailsPage;
