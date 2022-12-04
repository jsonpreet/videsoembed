import { getVideoThumbnail } from '@utils/getVideoThumbnail';
import { getThumbDuration } from '@utils/getThumbDuration';
import { getVideoTitle } from '@utils/getVideoTitle';
import { getPlaybackIdFromUrl, getVideoUrl } from '@utils/getVideoUrl';
import Deso from 'deso-protocol';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { APP } from '@utils/constants';
import truncate from '@utils/truncate';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false
})

const Video = ({ video }) => {
    const [videoData, setVideoData] = useState(null);
    const userProfile = video?.ProfileEntryResponse;
    const videoUrl = getVideoUrl(video);
    const videoTitle = getVideoTitle(video);

    useEffect(() => {
        getVideoData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video])

    const getVideoData = async () => {
        const deso = new Deso({ identityConfig: { host: "server" } })
        const videoID = getPlaybackIdFromUrl(video);
        const request = {
            "videoId": videoID
        }
        try {
            const videoData = await deso.media.getVideoStatus(request)
            const duration = getThumbDuration(videoData.data.Duration);
            const thumb = getVideoThumbnail(video, duration);
            setVideoData({ id: videoID, thumbnail: thumb.url, data: videoData.data, hls: `https://customer-wgoygazehbn8yt5i.cloudflarestream.com/${videoID}/manifest/video.m3u8` })
        } catch (error) {
            console.error(video.PostHashHex, 'thumbnail', error);
        }
    }

    return (
        <>
            {videoData ?
            <>
                <NextSeo
                    title={truncate(videoTitle, 100)}
                    description={truncate(videoTitle, 100)}
                    canonical={`${APP.URL}/watch/${video.PostHashHex}`}
                    openGraph={{
                        title: truncate(videoTitle, 100),
                        description: truncate(videoTitle, 100),
                        url: `${APP.URL}/watch/${video.PostHashHex}`,
                        images: [
                            {
                                url: videoData.thubmnail,
                                alt: truncate(videoTitle, 100),
                            },
                        ],
                    }}
                />
                <Head>
                    <meta property="og:video" content={videoData.hls} />
                    <meta property="og:video:width" content="1280" />
                    <meta property="og:video:height" content="720" />
                    <meta
                        property="og:video:url"
                        content={`${APP.URL}/watch/${video.PostHashHex}`}
                    />
                    <meta property="og:video:type" content="text/html" />
                    <meta
                        property="og:video:secure_url"
                        content={`${APP.URL}/watch/${video.PostHashHex}`}
                    />
                    <meta property="twitter:player:width" content="1280" />
                    <meta property="twitter:player:height" content="720" />
                    <meta
                        name="twitter:player"
                        content={`${APP.EMBED_URL}/${video.PostHashHex}`}
                    />
                    <link
                        rel="iframely player"
                        type="text/html"
                        href={`${APP.EMBED_URL}/${video.PostHashHex}`}
                        media="(aspect-ratio: 1280/720)"
                    />
                </Head>
                <div className="relative w-screen h-screen">
                    <VideoPlayer
                        source={videoUrl}
                        videoData={videoData}
                        hls={videoData.hls}
                        video={video}
                        poster={videoData.thubmnail}
                    />
                </div>
            </>
                : null
            }
        </>
    )
}

export default Video