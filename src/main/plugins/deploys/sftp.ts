import path from 'path'
import * as fse from 'fs-extra'
// import * as fs from 'fs'
import SftpClient from 'ssh2-sftp-client'
import { NodeSSH } from 'node-ssh'
import normalizePath from 'normalize-path'
import Model from '../../model'

interface sftpConnectConfig {
  host: string
  port: number
  type?: string
  username: string
  password?: string
  privateKey?: string | Buffer
}

export default class SftpDeploy extends Model {
  // connect: SftpClient
  constructor(appInstance: any) {
    super(appInstance)
    // this.connect = new SftpClient()
    // eslint-disable-next-line no-console
    console.log('instance sftp deploy')
  }

  async remoteDetect() {
    const result = {
      success: true,
      message: ''
    }

    const client = new SftpClient()

    const { setting } = this.db

    const connectConfig: sftpConnectConfig = {
      host: setting.server,
      port: Number(setting.port),
      username: setting.username
    }

    if (setting.privateKey) {
      try {
        connectConfig.privateKey = fse.readFileSync(setting.privateKey)
      } catch (e: any) {
        console.error('SFTP Test Remote Error: ', e.message)
        result.success = false
        result.message = e.message
        return result
      }
    } else {
      connectConfig.password = setting.password
    }

    const testFilename = 'gridea.txt'
    const localTestFilePath = normalizePath(path.join(this.appDir, testFilename))
    const remoteTestFilePath = normalizePath(path.join(setting.remotePath, testFilename))

    try {
      await client.connect(connectConfig)
      await client.list('/')

      try {
        fse.writeFileSync(localTestFilePath, 'This is gridea test file. you can delete it.')

        await client.put(localTestFilePath, remoteTestFilePath)
        await client.delete(remoteTestFilePath)
      } catch (e: any) {
        console.error('SFTP Test Remote Error: ', e.message)
        result.success = false
        result.message = e.message
      } finally {
        if (fse.existsSync(localTestFilePath)) {
          fse.unlinkSync(localTestFilePath)
        }
      }
    } catch (e: any) {
      console.error('SFTP Test Remote Error: ', e.message)
      result.success = false
      result.message = e.message
    } finally {
      await client.end()
    }

    return result
  }

  async publish() {
    const result = {
      success: true,
      message: ''
    }

    const client = new NodeSSH()

    const { setting } = this.db

    const connectConfig: sftpConnectConfig = {
      host: setting.server,
      port: Number(setting.port),
      type: 'sftp',
      username: setting.username
    }

    // node-ssh: privateKey is path string.
    if (setting.privateKey) {
      connectConfig.privateKey = setting.privateKey
    } else {
      connectConfig.password = setting.password
    }

    const localPath = normalizePath(path.join(this.buildDir))
    const remotePath = normalizePath(path.join(setting.remotePath))

    try {
      await client.connect(connectConfig)
      try {
        await client.exec('rm', ['-rf', remotePath])
        await client.mkdir(remotePath)
        await client.putDirectory(localPath, remotePath, {
          recursive: true,
          concurrency: 1, // 解决同步丢失js、css、图片文件问题
          validate(itemPath: string) {
            const baseName = path.basename(itemPath)
            return (
              baseName.substring(0, 1) !== '.' && // do not allow dot files
              baseName !== 'node_modules'
            ) // do not allow node_modules
          }
        })
      } catch (e: any) {
        console.error('SFTP Publish Error: ', e.message)
        result.success = false
        result.message = e.message
      }
    } catch (e: any) {
      console.error('SFTP Publish Error: ', e.message)
      result.success = false
      result.message = e.message
    } finally {
      await client.dispose()
    }

    return result
  }
}
