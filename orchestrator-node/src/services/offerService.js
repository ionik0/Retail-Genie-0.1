const OFFERS = [
    { code: "JEANS10", category: "jeans", discount: 10, desc: "10% off on all jeans" },
    { code: "NEWUSER50", category: "all", discount: 50, desc: "Flat ₹50 off for new users" }
];

exports.getApplicableOffers = (products) => {
    return OFFERS.filter(o =>
        o.category === "all" ||
        products.some(p => p.category === o.category)
    );
};
