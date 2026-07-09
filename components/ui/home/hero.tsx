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

import HeaderImage from "./image-header";

export default async function Hero() {
    return (
        <div className="lg:bg-darker h-auto lg:min-h-[75dvh] w-full flex items-stretch">
            <div className="lg:container relative mx-auto w-full flex justify-center items-center lg:justify-start">
                <Card className="absolute lg:px-6 lg:static lg:bg-darker h-full rounded-none justify-center bg-transparent max-w-[379] w-full border-0 p-0 text-center items-center lg:items-start text-white shadow-none lg:max-w-lg lg:text-left z-10">
                    <CardHeader className="p-0 w-full">
                        <CardDescription className="text-overline text-primary">
                            NEW PRODUCT
                        </CardDescription>
                        <CardTitle className="text-h2 lg:text-h1 p-0">
                            XX99 MARK II HEADPHONES
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-w-[349px] text-accent lg:px-0">
                        Experience natural, lifelike audio and exceptional build
                        quality made for the passionate music enthusiast.
                    </CardContent>
                    <CardFooter className="p-0 flex justify-center lg:justify-start">
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
                {/* <div className="w-full h-full overflow-hidden"> */}
                <HeaderImage />
                {/* </div> */}
            </div>
        </div>
    );
}
