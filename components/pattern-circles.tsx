import Image from "next/image";
import PatternCirclesImage from "@/assets/home/desktop/pattern-circles.svg";

export default function PatternCircles({
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div {...props}>
            <Image
                src={PatternCirclesImage}
                width={944}
                height={944}
                alt="..."
            />
        </div>
    );
}
