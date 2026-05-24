async function getProducts() {
  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main style={{ padding: "20px" }}>
      <h1>Allo Inventory System</h1>

      {products.map((product: any) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <h3>Warehouses</h3>

          {product.inventories.map(
            (inventory: any) => (
              <div
                key={inventory.id}
              >
                <p>
                  Warehouse:
                  {" "}
                  {
                    inventory
                      .warehouse
                      .name
                  }
                </p>

                <p>
                  Total Units:
                  {" "}
                  {
                    inventory.totalUnits
                  }
                </p>

                <p>
                  Reserved:
                  {" "}
                  {
                    inventory.reservedUnits
                  }
                </p>

                <p>
                  Available:
                  {" "}
                  {inventory.totalUnits -
                    inventory.reservedUnits}
                </p>
                <button
  style={{
    padding: "8px 12px",
    marginTop: "10px",
    cursor: "pointer",
  }}
>
  Reserve
</button>
              </div>
            )
          )}
        </div>
      ))}
    </main>
  );
}