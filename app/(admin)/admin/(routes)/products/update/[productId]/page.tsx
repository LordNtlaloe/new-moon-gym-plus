'use client'
import UpdateProductForm from '@/components/products/UpdateProductForm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getProductById } from '@/app/_actions/_productsActions'

const UpdateProductPage = () => {
    const params = useParams();
    const productId = params?.productId as string; // Assert productId as string

    const [product, setProduct] = useState(null);

    const getProduct = async () => {
        if (productId) {
            const result = await getProductById(productId);
            if (result) setProduct(result);
        }
    };

    useEffect(() => {
        getProduct();
    }, [productId]);

    return (
        <main className="md:max-w-5xl mt-20 shadow-lg flex flex-col mx-auto rounded-md justify-center mb-6">
            <div className="flex">
                <section className="p-4 bg-white w-full">
                    <h1 className="text-center font-semibold text-gray-900">Update Product</h1>
                    <UpdateProductForm product={product} />
                </section>
            </div>
        </main>
    );
};

export default UpdateProductPage;
