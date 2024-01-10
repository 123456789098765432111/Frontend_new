import { CartContext } from "@/lib/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import initializeAOS from "@/utils/aosConfig";
import 'aos/dist/aos.css';
// Utility function to format price with a comma for thousands
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts }) {
  const { addProduct } = useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchData,setSearchData]=useState([])

  useEffect(() => {
    initializeAOS()
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filterProducts = () => {
    if (searchQuery === "") {
      setFilteredProducts(allProducts);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseQuery)
      );
      setSearchData(filtered);
      console.log(searchData);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery]);

  return (
    <div className="flex justify-center min-h-screen w-full relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-14 md:mt-6 w-full px-4 md:p-0">
          <div className="relative">
          <input
            data-aos='fade-down'
            data-aos-duration={1200}
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 px-4 py-2 rounded-lg border border-gray-300 w-full outline-none" // Increased the input size
          />
          {
            searchQuery.length>0?
            <div style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} className="absolute overflow-y-auto max-h-[210px] sm:max-h-[245px] lg:max-h-[280px]  xl:max-h-[358px] w-full bg-white top-[90%] left-0 z-10 rounded-lg  p-3 sm:pl-4 sm:pr-4 border-solid border-[1px] border-slate-200">
              <div className="pb-1.5 border-solid border-b-2 border-slate-400 flex items-center w-full">
                <p className="flex-1 text-sm md:text-[16px]">SearchResults: <span className="text-sm ml-1 p-[2px] rounded-lg bg-gray-300 ">#{searchQuery}</span></p>
              <div className="flex flex-col items-start sm:flex-row">
                <p className="text-sm md:text-[16px]">{searchData.length} results</p>
                <button onClick={e=>setSearchQuery("")} className="text-orange-600 sm:ml-[8px] text-sm md:text-[16px]">Clear Search</button>
              </div>
              </div>
              {
                searchData.length>0?
                <div className="">
                {
                  searchData?.map((x,i)=>
                    <Link key={x.id} href={'/products/' + x._id}>
                      <div  className="flex items-center w-full max-h-[90px] min-h-[90px] md:max-h-[100px] md:min-h-[100px] lg:max-h-[110xp] lg:min-h-[110px] p-2 rounded-lg mt-5 bg-white hover:bg-slate-200" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                        <img className="w-[70px] md:w-[80px] lg:w-[85px] rounded-md aspeect-square" src={x.images[0]} />
                        <h1 className="text-[13px] sm:text-sm ml-2 flex-1">{x.title}</h1>
                        <strong className="mr-1 ml-2 text-orange-600 text-sm md:text-[16px]">ksh. {formatPrice(x.price)}</strong>
                      </div>
                    </Link>
                  )
                }
                </div>
                :
                <div className="h-[135px]  sm:h-[180px] lg:h-[220px]  xl:h-[300px] flex flex-col items-center justify-center">
                  <img className="object-contain w-[110px] sm:w-[145px] lg:w-[190px]  xl:w-[250px]" src="https://static.vecteezy.com/system/resources/previews/004/968/529/original/search-no-results-found-concept-illustration-flat-design-eps10-simple-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-with-editable-stroke-line-outline-linear-vector.jpg" alt="404"/>
                  <p>No results found</p>
                </div>
              }

            </div>
            :
            null
          }

          </div>
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 px-2">
              {filteredProducts.map((product) => (
                  <div  key={product._id} className="group relative">
                  <div data-aos="fade-up" data-aos-anchor-placement="bottom" data-aos-duration={900} className="group block overflow-hidden border border-accent rounded-xl border-opacity-10 shadow-md md:shadow-lg lg:shadow-xl group-hover:scale-150">
                    <div className="p-0">
                      <div className="relative md:h-[300px] h-[200px]">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="absolute inset-0 h-full w-full object-fill opacity-100"
                        />
                        {/* <img
                          src={product.images[1]}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100"
                        /> */}
                      </div>

                      <div className="relative p-3 border-t">
                      <Link href={'/products/' + product._id}>
                      <h3
                        className="text-md text-gray-700 group-hover:underline group-hover:underline-offset-4 truncate"
                      >
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-1.5 flex items-center justify-between text-text">
                      <p className="tracking-wide text-primary">ksh. {formatPrice(product.price)}</p>


                      <button onClick={() => {addProduct(product._id);
                         toast.success('Item added to cart!!')}} type="button" class="flex items-center divide-x rounded-lg border border-primary bg-white text-center text-md font-medium text-secondary-700 shadow-sm hover:bg-gray-100">
                        <div class="flex items-center space-x-2 py-2.5 px-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>


                          <span>Add</span>
                        </div>
                        {/* <div class="py-2.5 px-3">18</div> */}
                      </button>

                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          {/* )} */}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const allProducts = await Product.find({}, null, { sort: { _id: 1 } });

  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(allProducts)),
    },
  };
}

// initial code
// import { CartContext } from "@/lib/CartContext";
// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import Link from "next/link";
// import { useContext, useEffect, useState } from "react";
// import Spinner from "../components/Spinner";
// import toast from "react-hot-toast";

// // Utility function to format price with a comma for thousands
// const formatPrice = (price) => {
//   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// export default function Products({ allProducts }) {
//   const { addProduct } = useContext(CartContext)

//   const [loading, setLoading] = useState(true); // Step 1: Initialize loading state

//   useEffect(() => {
//     // Simulate loading effect with a delay (you can replace this with your API fetch)
//     setTimeout(() => {
//       setLoading(false); // Step 3: Set loading to false after fetching data (replace with your data fetching logic)
//     }, 2000); // Delay for 2 seconds (adjust as needed)
//   }, []); // Empty dependency array to run once on component mount
//   return (
//     <div className="flex justify-center items-center min-h-screen w-full">
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="mt-14 md:mt-6 grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 px-2">
//           {allProducts.map((product) => (
//             <div key={product._id}>
//               <div className="group block overflow-hidden border border-accent rounded-xl border-opacity-10">
//                 <div className="">
//                   <div className="relative md:h-[300px] h-[200px]">
//                     <img
//                       src={product.images[0]}
//                       alt=""
//                       className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0"
//                     />
//                     <img
//                       src={product.images[1]}
//                       alt=""
//                       className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100"
//                     />
//                   </div>

//                   <div className="relative p-3 border-t">
//                     <Link href={'/products/'+ product._id}>
//                       <h3 className="text-md text-gray-700 group-hover:underline group-hover:underline-offset-4 truncate">
//                         {product.title}
//                       </h3>
//                     </Link>

//                     <div className="mt-1.5 flex flex-col   items-center justify-between text-text">
//                       <p className="tracking-wide text-primary text-sm md:text-md">ksh. {formatPrice(product.price)}</p>

//                       <div class="col-span-12 text-center w-full mt-3">
//                         <button
//                           onClick={() => {addProduct(product._id); toast.success('Item added to cart!')}}
//                           className="disabled block rounded bg-secondary px-5 py-3 text-md text-text w-full transition hover:bg-purple-300"
//                         >
//                           Add to cart
//                         </button>
//                       </div>
                      
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

// }


// export async function getServerSideProps() {
//   await mongooseConnect();
//   const allProducts = await Product.find({}, null, { sort: { '_id': 1 } })

//   return {
//     props: {
//       allProducts: JSON.parse(JSON.stringify(allProducts))
//     },
//   };
// }
