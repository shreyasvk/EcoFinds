const pool = require("../db");

const getProductBySeller = async (req, res) => {
    const seller_id = req.seller.seller_id;

    try {

        const result = await pool.query(`
            SELECT COUNT(*) AS number_of_items
            FROM products
            WHERE seller_id = $1
        `, [seller_id]);

        const numberOfItems = parseInt(result.rows[0].number_of_items, 10);

        res.status(200).json({
            message: "Number of items retrieved successfully",
            items: numberOfItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};


const getProduct = async (req, res) => {
    const getProductQuery = `SELECT * FROM products`;

    try {
        const { rows } = await pool.query(getProductQuery);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No products available to display." });
        }

        res.status(200).json({
            products: rows
        });
    } catch (e) {
        console.error(`Error fetching products: ${e.message}`);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const postProduct = async (req, res) => {
    const user_id = req.user.userId;

    // console.log('req.body:', req.body);
    // console.log('req.file:', req.file);

    const { name, description, price, stock, ecofriendly, carbonneutral, recycle, image_url, seller_id } = req.body;
    console.log(`${name}, ${description}, ${price}, ${stock}, ${ecofriendly}, ${carbonneutral}, ${seller_id}, ${recycle}, ${image_url}`)
    if (!name || !description || !price || !stock || !ecofriendly || !carbonneutral || !recycle || !image_url || !seller_id) {
        return res.status(400).json({
            message: "Please make sure all fields are filled and seller ID is provided."
        });
    }

    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
        return res.status(400).json({
            message: "Price must be a positive number and stock should be a non-negative number."
        });
    }

    try {
        // Check if the seller ID exists in the sellers table
        const sellerResult = await pool.query('SELECT * FROM sellers WHERE seller_id = $1', [seller_id]);

        if (sellerResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid seller ID."
            });
        }

        // Proceed with inserting the product
        const insertQuery = `INSERT INTO products (seller_id, name, description, price, stock,ecofriendly,carbonneutral,recycle, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING *`;
        const values = [seller_id, name, description, price, stock, ecofriendly, carbonneutral, recycle, image_url];

        const result = await pool.query(insertQuery, values);

        const newProduct = result.rows[0];

        res.status(200).json({
            message: "Product Created Successfully",
            product: newProduct
        });
    } catch (e) {
        console.log(`Error creating product: ${e}`);
        res.status(500).json({ message: `${e.message}` });
    }
};

const getSingleProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const singleProductQuery = `SELECT * FROM products WHERE product_id = ($1)`
        const result = await pool.query(singleProductQuery, [productId])
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Product does not exits" })
        }
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { price, stock } = req.body;

    // Initialize query components
    const setClause = [];
    const queryParams = [];
    let index = 1;

    // Check if price is provided and valid
    if (price !== undefined) {
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ message: "Invalid price value" });
        }
        setClause.push(`price = $${index++}`);
        queryParams.push(parsedPrice);
    }

    // Check if stock is provided and valid
    if (stock !== undefined) {
        const parsedStock = parseInt(stock, 10);
        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }
        setClause.push(`stock = $${index++}`);
        queryParams.push(parsedStock);
    }

    // If no fields are provided, return an error
    if (setClause.length === 0) {
        return res.status(400).json({ message: "No fields to update provided" });
    }

    // Append productId for the WHERE clause
    queryParams.push(productId);

    // Construct and execute the SQL query
    const updateQuery = `UPDATE products SET ${setClause.join(', ')} WHERE product_id = $${index} RETURNING *`;

    try {
        const result = await pool.query(updateQuery, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No product found with the given ID" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            result: result.rows[0]
        });
    } catch (e) {
        console.error('Error updating product:', e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const deleteQuery = `DELETE FROM products WHERE product_id = $1 RETURNING *`
    try {
        const result = await pool.query(deleteQuery, [productId]);
        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "No Products Found"
            })
        }
        res.status(200).json("Product Removed Successfully")
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    getProduct, postProduct, getSingleProduct, updateProduct, deleteProduct, getProductBySeller
}