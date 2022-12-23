
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import PlayerContextMenu from './PlayerContextMenu'
import { getCurrentDuration } from '@utils/getCurrentDuration'
import { APP } from '@utils/constants'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Media, Hls, Poster, Gesture, PlayButton, MuteButton, FullscreenButton, TimeSlider, VolumeSlider, Time, SliderValueText } from '@vidstack/player-react'

const PlayerInstance = ({ videoData, extraData, video, source, ratio, hls, poster }) => {
    const router = useRouter()
    const playerRef = useRef(null)
    const videoRef = useRef(null)
    const supabase = useSupabaseClient()
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVideoLoop, setIsVideoLoop] = useState(false)
    const [isStarted, setisStarted] = useState(false)
    const { pathname } = useRouter()
    const currentDuration = getCurrentDuration(videoData ? videoData.data.Duration : extraData.Duration);
    const reader = APP.PublicKeyBase58Check;

    useEffect(() => {
        if (!isStarted) return
        setNewView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStarted])

    const onContextClick = (event) => {
        event.preventDefault()
        setShowContextMenu(false)
        const newPosition = {
            x: event.pageX,
            y: event.pageY
        }
        setPosition(newPosition)
        setShowContextMenu(true)
    }

    const setNewView = () => {
        const req = {
            posthash: video.PostHashHex,
            channel: video.ProfileEntryResponse.Username,
            user: reader,
            lastwatched: new Date()
        }
        supabase.from('views').insert([req]).then((response) => {
            if (response.error) {
                console.log(video.PostHashHex, 'views', response.error);
            }
            return
        })
    }

    const onDataLoaded = async (event) => {
        if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
            console.log(videoRef.current.duration.toFixed(2))
        }
        console.log(videoRef.current?.currentTime);
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadeddata = onDataLoaded
        }
        console.log(videoRef.current?.currentTime);
        const currentVideo = document.getElementsByTagName('video')[0]
        currentVideo.ontimeupdate = (event) => {
            const seconds = Math.round(event.target.currentTime)
            if (seconds === currentDuration) {
                setisStarted(true);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div
                onContextMenu={onContextClick}
                className="relative z-[5] justify-center items-center h-full w-full"
            >
                <Media
                    className='w-full h-full'
                >
                    <div className="media-buffering-container">
                        <svg className="media-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
                            <circle
                                className="media-buffering-track"
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="currentColor"
                                strokeWidth="8"
                            ></circle>
                            <circle
                                className="media-buffering-track-fill"
                                cx="60"
                                cy="60"
                                r="54"
                                stroke="currentColor"
                                strokeWidth="10"
                                pathLength="100"
                            ></circle>
                        </svg>
                    </div>
                    <div className='flex w-full h-full items-center justify-center'>
                        <Hls
                            ref={playerRef}
                            hlsLibrary={() => import('hls.js')}
                            poster={poster}
                            hlsConfig={{ lowLatencyMode: true }}
                        >
                            <video
                                ref={videoRef}
                                src={hls}
                                preload="none"
                            ></video>
                        </Hls>
                    </div>
                    <Poster />
                    <div className="absolute left-0 bottom-5 w-full z-50 px-4 flex flex-col">
                        <TimeSlider>
                            <div className="slider-track"></div>
                            <div className="slider-track fill"></div>
                            <div className="slider-thumb-container">
                                <div className="slider-thumb"></div>
                            </div>
                            <div className="media-time-container">
                                <SliderValueText type="pointer" format="time" />
                            </div>
                        </TimeSlider>
                        <div className="flex w-full space-x-2 -mt-3">
                            <div className='flex-1 items-center flex space-x-3 -ml-2'>
                                <div>
                                    <PlayButton>
                                        <svg className="media-play-icon" aria-hidden="true" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
                                            />
                                        </svg>
                                        <svg className="media-pause-icon" aria-hidden="true" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M6 5h2v14H6V5zm10 0h2v14h-2V5z" />
                                        </svg>
                                        <svg className="media-replay-icon" aria-hidden="true" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                                            />
                                        </svg>
                                    </PlayButton>
                                </div>
                                <div className='flex items-center group space-x-2'>
                                    <div>
                                        <MuteButton>
                                            <svg className="media-mute-icon" aria-hidden="true" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536l-1.414 1.414L19 13.414l-3.536 3.536l-1.414-1.414L17.586 12L14.05 8.464l1.414-1.414L19 10.586l3.536-3.536l1.414 1.414L20.414 12z"
                                                />
                                            </svg>
                                            <svg className="media-unmute-icon" aria-hidden="true" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"
                                                />
                                            </svg>
                                        </MuteButton>
                                    </div>
                                    <div className='w-0 flex-1 opacity-0 group-hover:w-40 group-hover:opacity-100 transition-all delay-150 duration-300'>
                                        <VolumeSlider>
                                            <div className="slider-track"></div>
                                            <div className="slider-track fill"></div>
                                            <div className="slider-thumb-container">
                                                <div className="slider-thumb"></div>
                                            </div>
                                        </VolumeSlider>
                                    </div>
                                    <div className='w-44 md:w-56 flex space-x-1'>
                                        <Time type="current" />
                                        <span className='text-white'>/</span>
                                        <Time type="duration" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div>
                                    <FullscreenButton>
                                        <svg className="media-enter-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"
                                            />
                                        </svg>
                                        <svg className="media-exit-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
                                            />
                                        </svg>
                                    </FullscreenButton>
                                </div>
                            </div>    
                        </div>
                        
                    </div>              
                    <div>
                        <Gesture type="mouseleave" action="pause"></Gesture>
                        <Gesture type="click" action="toggle:paused"></Gesture>
                        <Gesture type="click" repeat={1} priority={1} action="toggle:fullscreen"></Gesture>
                        <Gesture
                            className="seek-gesture left"
                            type="click"
                            repeat={1}
                            priority={0}
                            action="seek:-30"
                        ></Gesture>
                        <Gesture
                            className="seek-gesture right"
                            type="click"
                            repeat={1}
                            priority={0}
                            action="seek:30"
                        ></Gesture>
                    </div>
                </Media>
                {showContextMenu ?
                    <PlayerContextMenu
                        position={position}
                        ref={videoRef}
                        hideContextMenu={() => setShowContextMenu(false)}
                        isVideoLoop={isVideoLoop}
                        setIsVideoLoop={setIsVideoLoop}
                        videoId={video.PostHashHex}
                    />
                    : null
                }
            </div>
        </>
    )
}

const NewVideoPlayer = ({videoData, extraData, video, source, poster, ratio = '16:9', wrapperClassName, hls}) => {
    return (
        <>
            <PlayerInstance
                videoData={videoData}
                extraData={extraData}
                source={source}
                video={video}
                ratio={ratio}
                poster={poster}
                hls={hls}
            />
        </>
    )
}

export default NewVideoPlayer