import forge from 'node-forge'

export const encodePwd = async (pemPublicKey: string, password: string) => {
  const publicKey = forge.pki.publicKeyFromPem(pemPublicKey)

  const encrypted = publicKey.encrypt(password, 'RSAES-PKCS1-V1_5')

  return forge.util.encode64(encrypted)
}
