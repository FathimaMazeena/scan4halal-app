import React from "react";

function Accordion() {
  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto m-20">
      <h2 class="text-2xl font-bold text-warning mb-4 tracking-wide">Frequently Asked Questions</h2>
      <div className="join join-vertical bg-base-100">
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked />
          <div className="collapse-title font-semibold">
            What is Scan4Halal and how does it work?
          </div>
          <div className="collapse-content text-sm">
            Scan4Halal is a smart ingredient scanner that helps you instantly check whether food products are Halal, Haram, or Doubtful. 
            Simply scan the product label, and our system uses OCR & AI-powered ingredient matching to give you a clear verdict 
            with detailed explanations.
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title font-semibold">
            What does “Doubtful” mean in Scan4Halal results?
          </div>
          <div className="collapse-content text-sm">
            “Doubtful” means the ingredient is ambiguous — it may be Halal in some cases and Haram in others, 
            depending on its source or processing method.
            We provide this status when further verification is needed, so you can make an informed decision.
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title font-semibold">
            How do I update my profile information?
          </div>
          <div className="collapse-content text-sm">
            Go to "My Account" settings and select "Edit Profile" to make
            changes.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
