interface OgTemplateProps {
  title: string;
  category?: string;
  author?: string;
  publishedAt?: string;
}

export default function OgTemplate({ title, category, author, publishedAt }: OgTemplateProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#1f2937',
        backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        padding: '60px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          TeknoPulse
        </div>
        {category && (
          <div
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            {category}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: '1.1',
            margin: 0,
            marginBottom: '20px',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            color: '#9ca3af',
            fontSize: '20px',
          }}
        >
          Berita harian teknologi dan AI
        </div>
        {(author || publishedAt) && (
          <div
            style={{
              color: '#9ca3af',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {author && <span>By {author}</span>}
            {publishedAt && <span>{publishedAt}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
