import { useCallback, useMemo, useState } from "react";
import { products as initialProducts } from "./data";
import ProductTable from "./ProductTable";

function ProductDashboard() {
  const [filterText, setFilterText] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState(initialProducts);
  const [showHelp, setShowHelp] = useState(false);

  console.log("Dashboard render");

  const filteredProducts = useMemo(() => {
    console.log("Filtering products...");
    const searchText = filterText.toLowerCase();

    return items.filter(
      (product) =>
        product.name.toLowerCase().includes(searchText) &&
        (category === "all" || product.category === category)
    );
  }, [items, filterText, category]);

  const totalPrice = useMemo(() => {
    console.log("Computing total price...");

    return filteredProducts.reduce((sum, product) => {
      // Simulate an expensive calculation for the memoization exercise.
      for (let i = 0; i < 5000; i++) {
        Math.sqrt(product.price + i);
      }
      return sum + product.price;
    }, 0);
  }, [filteredProducts]);

  const handleToggleFavorite = useCallback((id) => {
    setItems((previousItems) =>
      previousItems.map((product) =>
        product.id === id
          ? { ...product, favorite: !product.favorite }
          : product
      )
    );
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Dashboard</h1>

      {/* State unrelated to filtering — useful for testing useMemo optimization */}
      <button
        onClick={() => setShowHelp((prev) => !prev)}
        style={{ marginBottom: "8px" }}
      >
        Toggle Help
      </button>
      {showHelp && (
        <p style={{ marginBottom: "16px" }}>
          This is a help text.
          {/* After applying useMemo, toggling this SHOULD NOT trigger
              "Filtering products..." or "Computing total price..." logs. */}
        </p>
      )}

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginRight: "12px" }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="book">Book</option>
          <option value="device">Device</option>
          <option value="etc">Etc</option>
        </select>
      </div>

      <p>Showing {filteredProducts.length} items</p>
      <p>Total price: {totalPrice.toFixed(2)}</p>

      <ProductTable
        products={filteredProducts}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default ProductDashboard;
