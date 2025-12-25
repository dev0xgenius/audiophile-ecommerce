import Image from "next/image";

export default function Logo() {
	return (
		<span>
			<Image src="/shared/mobile/logo.svg" width={143} height={25} alt="" />
		</span>
	);
}
