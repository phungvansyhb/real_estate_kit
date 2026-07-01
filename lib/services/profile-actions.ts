'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getCurrentUser } from '@/lib/supabase/auth'

import { updateCurrentAgentProfile } from './profile-service'

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(30),
  company: z.string().trim().max(120),
  bio: z.string().trim().max(512),
})

const acceptedAvatarTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxAvatarSizeInBytes = 5 * 1024 * 1024

function buildProfileRedirect(query: string) {
  return `/dashboard/profile?${query}`
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser()

  if (!user?.email) {
    redirect('/vi/login')
  }

  const parsed = profileSchema.safeParse({
    name: formData.get('name')?.toString() ?? '',
    phone: formData.get('phone')?.toString() ?? '',
    company: formData.get('company')?.toString() ?? '',
    bio: formData.get('bio')?.toString() ?? '',
  })

  if (!parsed.success) {
    redirect(buildProfileRedirect('error=invalid-form'))
  }

  const avatarFile = formData.get('avatar')
  const selectedAvatar = avatarFile instanceof File && avatarFile.size > 0 ? avatarFile : null

  if (selectedAvatar) {
    if (!acceptedAvatarTypes.has(selectedAvatar.type)) {
      redirect(buildProfileRedirect('error=invalid-avatar-type'))
    }

    if (selectedAvatar.size > maxAvatarSizeInBytes) {
      redirect(buildProfileRedirect('error=avatar-too-large'))
    }
  }

  try {
    await updateCurrentAgentProfile({
      userId: user.id,
      email: user.email,
      name: parsed.data.name,
      phone: parsed.data.phone,
      company: parsed.data.company,
      bio: parsed.data.bio,
      avatarFile: selectedAvatar,
    })
  } catch {
    redirect(buildProfileRedirect('error=update-failed'))
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  redirect(buildProfileRedirect('updated=1'))
}
