export function ProfileImage({ className, alt, ...props }: { alt: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/ui/profile-avatar.jpg"
            alt={alt}
            className={`h-9 w-9 rounded-full object-cover ${className || ''}`}
            {...props}
        />
    );
}