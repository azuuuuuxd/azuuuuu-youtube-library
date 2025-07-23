"use client"

import { useState } from "react"
import Image from "next/image"
import { Youtube, Calendar, Clock, Tag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { videosByYear } from "@/lib/videos"
import Link from "next/link"

// チャンネル情報
const channelInfo = {
  name: "Azu pp",
  description: "月一更新のclipsと不定期更新の動画を投稿しています。",
  avatar: "/avatar.png",
  videoCount: "54",
  channelUrl: "https://www.youtube.com/@azupp204",
}

export default function YouTubeThumbnailSite() {
  const [selectedYear, setSelectedYear] = useState("2025")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })
  }

  const getTagColor = (tag: string) => {
    if (tag === "近日公開") {
      return "bg-orange-100 text-orange-700 border-orange-200"
    }
    return "bg-blue-100 text-blue-700 border-blue-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Image
                src={channelInfo.avatar || "/placeholder.svg"}
                alt="チャンネルアバター"
                width={80}
                height={80}
                className="rounded-full border-4 border-red-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=80&width=80&text=Azu+pp"
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                <Youtube className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{channelInfo.name}</h1>
              <p className="text-gray-600 mb-3 max-w-2xl">{channelInfo.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {channelInfo.videoCount} 本の動画
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  月1回更新
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="2025" className="text-lg">
              2025年
            </TabsTrigger>
            <TabsTrigger value="2024" className="text-lg">
              2024年
            </TabsTrigger>
            <TabsTrigger value="2023" className="text-lg">
              2023年
            </TabsTrigger>
            <TabsTrigger value="2022" className="text-lg">
              2022年
            </TabsTrigger>
          </TabsList>

          {Object.entries(videosByYear).map(([year, videos]) => (
            <TabsContent key={year} value={year}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Link href={`/video/${video.id}`} key={video.id}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            width={320}
                            height={180}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=180&width=320&text=Video+Thumbnail"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {video.title}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {video.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className={`text-xs ${getTagColor(tag)}`}>
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex-grow"></div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {formatDate(video.uploadDate)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
