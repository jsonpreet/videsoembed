import { Video } from '@components/Video'
import Deso from 'deso-protocol'
import { APP } from '@utils/constants'

export default Video


export const getServerSideProps = async (context) => {
    const request = {
        ReaderPublicKeyBase58Check: APP.PublicKeyBase58Check,
        PostHashHex: context.query.id
    }
    const deso = new Deso({ identityConfig: { host: "server" } })
    const response = await deso.posts.getSinglePost(request);
    if (!response.PostFound) {
        return null
    }
    context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
    return {
        props: { video: response.PostFound }
    }
}