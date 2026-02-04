import React, { useState } from "react";

const ClientPage = () => {
  // Define state for form inputs
  const [formData, setFormData] = useState({
    country: "",
    location: "",
    email: "",
    age: "",
    careStatus: "", // 'needsCare' or 'activeNow'
  });

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here
    console.log(formData);
    alert("Client info submitted!");
  };

  return (
    <div className="client-form-container">
      <h2>Client Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Country Input */}
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter Country"
            required
          />
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter Location"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Age Input */}
        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter Age"
            required
          />
        </div>

        {/* Needs Care / Active Now Radio Buttons */}
        <div>
          {/* Needs Care Radio */}
          <div>
            <input
              type="radio"
              id="needsCare"
              name="careStatus"
              value="needsCare"
              checked={formData.careStatus === "needsCare"}
              onChange={handleChange}
            />
            <label htmlFor="needsCare">Needs Care</label>
          </div>

          {/* Active Now Radio */}
          <div>
            <input
              type="radio"
              id="activeNow"
              name="careStatus"
              value="activeNow"
              checked={formData.careStatus === "activeNow"}
              onChange={handleChange}
            />
            <label htmlFor="activeNow">Active Now</label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ClientPage;
