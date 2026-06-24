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
        <div className="h-auto lg:bg-darker">
            <div className="overflow-hidden relative min-h-[60dvh] flex items-center justify-center py-28 lg:max-w-[1110px] lg:mx-auto lg:px-10">
                <div className="lg:flex lg:flex-row lg:items-center lg:w-full">
                    <Card className="max-w-[379] bg-transparent p-0 border-0 text-center text-white shadow-none lg:text-left lg:max-w-[445px] lg:w-1/2">
                        <CardHeader className="p-0">
                            <CardDescription className="text-overline text-primary">
                                NEW PRODUCT
                            </CardDescription>
                            <CardTitle className="text-h1 p-0">
                                XX99 MARK II HEADPHONES
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-accent">
                            Experience natural, lifelike audio and exceptional build
                            quality made for the passionate music enthusiast.
                        </CardContent>
                        <CardFooter className="flex justify-center lg:justify-start">
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
                    <div className="absolute w-full h-full left-6/12 top-4/12 -translate-y-6/12 -translate-x-6/12 -z-10 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 lg:z-auto lg:w-1/2 lg:flex lg:justify-center">
                        <HeaderImage />
                    </div>
                </div>
            </div>
        </div>
    );
}
