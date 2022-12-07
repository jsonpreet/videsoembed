
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import PlayerContextMenu from './PlayerContextMenu'
import {
  DefaultControls,
  DefaultSettings,
  DefaultUi,
  Hls,
  Player,
  Poster,
} from '@vime/react'
import { getCurrentDuration } from '@utils/getCurrentDuration'
import { APP } from '@utils/constants'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const PlayerInstance = ({ videoData, extraData, video, source, ratio, hls, poster }) => {
    const router = useRouter()
    const playerRef = useRef()
    const supabase = useSupabaseClient()
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVideoLoop, setIsVideoLoop] = useState(false)
    const [isStarted, setisStarted] = useState(false)
    const { pathname } = useRouter()
    const currentDuration = getCurrentDuration(videoData ? videoData.data.Duration : extraData.Duration);
    const reader = APP.PublicKeyBase58Check;

    const handleKeyboardShortcuts = () => {
        if (!playerRef.current) return
        playerRef.current.focus()

        // prevent default actions
        playerRef.current.addEventListener('keydown', (e) => {
            e.preventDefault()
        })

        playerRef.current.onfullscreenchange = () => {
            if (playerRef.current) playerRef.current.focus()
        }

        // Enable keyboard shortcuts in fullscreen
        document.addEventListener('keydown', (e) => {
        if (
            playerRef.current &&
            playerRef.current.isFullscreenActive &&
            e.target !== playerRef.current
        ) {
            // Create a new keyboard event
            const keyboardEvent = new KeyboardEvent('keydown', {
                key: e.key,
                code: e.code,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey
            })

            // dispatch it to the videoplayer
            playerRef.current.dispatchEvent(keyboardEvent)
        }
        })
    }

    useEffect(() => {
        if (!isStarted) return
        setNewView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStarted])

    useEffect(() => {
        if (playerRef.current) handleKeyboardShortcuts()
    })

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

    const onTimeUpdate = (event) => {
        const seconds = Math.round(event.detail)
        if (seconds === currentDuration) {
        setisStarted(true);
        }
    };

    const setNewView = () => {
        const req = {
            posthash: video.PostHashHex,
            channel: video.ProfileEntryResponse.Username,
            user: reader,
            lastwatched: new Date()
        }
        supabase.from('views').insert([req]).then((response) => {
            if (response.error) {
                logger.error(video.PostHashHex, 'views', response.error);
            }
            return
        })
    }


    return (
        <div onContextMenu={onContextClick}>
            <div className={`md:relative z-[5] aspect-[16/9]`}>
                <Player
                    tabIndex={1}
                    ref={playerRef}
                    aspectRatio={ratio}
                    onVmCurrentTimeChange={onTimeUpdate}
                    icons="material"
                >
                    <Hls version="latest" poster={poster}>
                        <source data-src={hls} type="application/x-mpegURL"/>
                    </Hls>
                    <DefaultUi noControls noPoster>
                        <Poster fit='contain' />
                        <DefaultControls hideOnMouseLeave activeDuration={2000} />
                        <DefaultSettings />
                    </DefaultUi>
                </Player>
            </div>
            {showContextMenu ?
                <PlayerContextMenu
                    position={position}
                    ref={playerRef}
                    hideContextMenu={() => setShowContextMenu(false)}
                    isVideoLoop={isVideoLoop}
                    setIsVideoLoop={setIsVideoLoop}
                    videoId={video.PostHashHex}
                />
                : null
            }
        </div>
    )
}

const VideoPlayer = ({videoData, extraData, video, source, poster, ratio = '16:9', wrapperClassName, hls}) => {
    return (
        <div className={clsx('overflow-hidden', wrapperClassName)}>
            <PlayerInstance
                videoData={videoData}
                extraData={extraData}
                source={source}
                video={video}
                ratio={ratio}
                poster={poster}
                hls={hls}
            />
        </div>
    )
}

export default VideoPlayer