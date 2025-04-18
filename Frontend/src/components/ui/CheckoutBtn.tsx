import React from "react";

const CheckoutBtn = () => {
  return (
    <div>
      <div className="checkoutcontainer w-full">
        <div className="checkoutleft-side w-full bg-purple-600">
          <div className="checkoutcard">
            <div className="checkoutcard-line"></div>
            <div className="checkoutbuttons"></div>
          </div>
          <div className="checkoutpost">
            <div className="checkoutpost-line"></div>
            <div className="checkoutscreen">
              <div className="checkoutdollar">$</div>
            </div>
            <div className="checkoutnumbers"></div>
            <div className="checkoutnumbers-line2"></div>
          </div>
        </div>
        <div className="checkoutright-side ">
          <div className="checkoutnew text-purple-500 tracking-wider">Pay via khalti</div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBtn;
