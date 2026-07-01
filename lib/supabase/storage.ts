import { createSlug } from '@/lib/utils'

import { createSupabaseServerClient } from './server'

const PROFILE_AVATAR_BUCKET = 'avatars'

function getSafeFileExtension(file: File) {
  const nameExtension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : undefined

  if (nameExtension && ['jpg', 'jpeg', 'png', 'webp'].includes(nameExtension)) {
    return nameExtension
  }

  if (file.type === 'image/png') {
    return 'png'
  }

  if (file.type === 'image/webp') {
    return 'webp'
  }

  return 'jpg'
}

export async function uploadProfileAvatar(input: { userId: string; file: File }) {
  const client = await createSupabaseServerClient()
  const extension = getSafeFileExtension(input.file)
  const baseName = createSlug(input.file.name.replace(/\.[^.]+$/, '')) || 'avatar'
  const objectPath = `${input.userId}/${Date.now()}-${baseName}.${extension}`

  const { error } = await client.storage.from(PROFILE_AVATAR_BUCKET).upload(objectPath, input.file, {
    cacheControl: '3600',
    contentType: input.file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw new Error(`Không thể tải ảnh đại diện lên: ${error.message}`)
  }

  const { data } = client.storage.from(PROFILE_AVATAR_BUCKET).getPublicUrl(objectPath)

  return data.publicUrl
}
