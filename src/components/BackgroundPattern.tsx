import Image from "next/image";

export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Image
        src="/assets/images/bg-patern-hexagon.png"
        alt="Background pattern"
        layout="fill"
        objectFit="cover"
        className="mix-blend-multiply opacity-5"
      />
    </div>
  );
}
