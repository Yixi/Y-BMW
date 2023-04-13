import forge from 'node-forge'
export const encodePwd = async (pemPublicKey: string, password: string) => {
  const publiKey = forge.pki.publicKeyFromPem(pemPublicKey)

  const encrypted = publiKey.encrypt(password, 'RSAES-PKCS1-V1_5')

  const encryptedBase64 = forge.util.encode64(encrypted)

  return encryptedBase64
}
