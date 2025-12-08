import { SpeakerImageMobile } from "@/lib/img-exports";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card";

import Image from "next/image";
import { Button } from "./button";

// TODO: Add Props to ProductCard to change the layout and color of the card
export default function ProductCard() {
    return (
        <Card className="p-14 px-6 shadow-sm items-center text-center rounded-2xl overflow-hidden">
            <CardHeader className="w-full gap-8 h-max">
                <CardDescription className="relative w-full flex justify-center items-center m-auto">
                    <div className="border size-80 rounded-full border-red-700 absolute" />
                    <div className="border size-[279px] rounded-full border-red-700 absolute" />
                    <Image
                        src={SpeakerImageMobile}
                        width={360}
                        height={360}
                        className="w-max"
                        alt=""
                    />
                </CardDescription>
                <CardTitle className="text-4xl font-normal pt-2">
                    ZX9 SPEAKER
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound
            </CardContent>
            <CardFooter>
                <Button variant="secondary" size="lg">
                    SEE PRODUCT
                </Button>
            </CardFooter>
        </Card>
    );
}
