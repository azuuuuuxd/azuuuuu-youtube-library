import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Tag, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { findVideoById } from "@/lib/videos"

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const video = findVideoById(params.id)

  if (!video) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTagColor = (tag: string) => {
    if (tag === "近日公開") {
      return "bg-orange-100 text-orange-700 border-orange-200"
    }
    return "bg-blue-100 text-blue-700 border-blue-200"
  }

  // YouTube動画IDが有効かどうかをチェック
  const hasValidVideoId = video.videoId && video.videoId.trim() !== "" && !video.tags.includes("近日公開")

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          サムネイル一覧に戻る
        </Link>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* サムネイル */}
            <div className="relative w-full h-64 md:h-80">
              <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
              <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded">
                <Clock className="w-4 h-4 inline mr-1" />
                {video.duration}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* タイトル */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {video.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className={`${getTagColor(tag)}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* 日付 */}
              <div className="flex items-center gap-2 text-gray-600 mb-8">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(video.uploadDate)}</span>
              </div>

              {/* YouTube動画埋め込み */}
              {hasValidVideoId ? (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">動画を視聴</h2>
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">動画について</h2>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-700">
                      {video.tags.includes("近日公開")
                        ? "この動画は近日公開予定です。"
                        : "この動画は現在視聴できません。"}
                    </p>
                  </div>
                </div>
              )}

              {/* 動画の説明・裏話 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">制作について</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {video.description || "この動画についての説明はまだ書かれていません。"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
