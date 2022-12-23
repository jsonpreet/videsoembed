
import clsx from 'clsx'
import { Player } from '@livepeer/react'

const PlayerInstance = ({ video, ratio, playbackId, source, poster }) => {
    return (
        <div className='md:relative z-[5]'>
            <Player
                poster={poster}
                playbackId={playbackId}
                aspectRatio={ratio}
                objectFit="contain"
                showPipButton={true}
                autoPlay={false}
                loop={true}
                showTitle={false}
                showUploadingIndicator={false}
            />
        </div>
    )
}

const LivePeerPlayer = ({ video, poster, playbackId, ratio = '16to9', wrapperClassName, source }) => {
    return (
        <div className={clsx('overflow-hidden', wrapperClassName)}>
            <PlayerInstance
                video={video}
                ratio={ratio}
                playbackId={playbackId}
                poster={poster}
                source={source}
            />
        </div>
    )
}

export default LivePeerPlayer