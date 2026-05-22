import Link from "next/link";
import { Button } from "../button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../card";

import Image from "next/image";

async function fetchLatestProduct() {
    console.log("Fetching Latest product data...");
    return { name: "prosper's stock 1" };
}

export default async function Hero() {
    const productData = await fetchLatestProduct();
    console.log(productData);

    return (
        <div>
            <div className="relative py-28">
                <Card className="bg-transparent p-0 border-none text-center text-white shadow-none">
                    <CardHeader>
                        <CardDescription className="text-sm tracking-[10px]">
                            NEW PRODUCT
                        </CardDescription>
                        <CardTitle className="text-4xl font-bold">
                            XX99 MARK II HEADPHONES
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-accent">
                        Experience natural, lifelike audio and exceptional build
                        quality made for the passionate music enthusiast.
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <CardAction>
                            <Link href="/headphones/xx99">
                                <Button
                                    size="lg"
                                    className="font-bold tracking-widest"
                                >
                                    SEE PRODUCT
                                </Button>
                            </Link>
                        </CardAction>
                    </CardFooter>
                </Card>
                <div className="absolute -top-2 left-0 bottom-0 right-0 bg-black -z-10">
                    <Image
                        width={1240}
                        height={720}
                        src={"/image-header.jpg"}
                        alt="A Headset"
                        className="h-full object-cover align-middle"
                    />
                </div>
            </div>
        </div>
    );
}
