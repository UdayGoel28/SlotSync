import Image from "next/image";

interface BusinessProfileHeroProps {
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
}

export function BusinessProfileHero({ name, description, logoUrl, coverUrl }: BusinessProfileHeroProps) {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 overflow-hidden mb-12">
      <div className="relative h-48 w-full bg-gradient-to-r from-[#E8EDE6] to-[#F5F0EA]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <svg className="w-24 h-24 text-sage-800" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 pt-0 relative">
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-sage-800">{name.charAt(0)}</span>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h1 className="text-3xl font-light font-serif tracking-tight text-[#2C2C2C]">{name}</h1>
          {description && (
            <p className="mt-4 text-sm text-[#2C2C2C]/80 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
